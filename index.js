let fs = require("fs");
let path = require("path");
var blessed = require("blessed"),
  contrib = require("blessed-contrib"),
  screen = blessed.screen(),
  tree = contrib.tree({
    fg: "green",
  });

// get directory structure
function directoryStructure(dirPath) {
  let parentChilds = { children: {} };
  fs.readdirSync(dirPath, { withFileTypes: true }).forEach((file) => {
    var name = file.name;
    if (file.isDirectory()) {
      let newDirPath = path.join(dirPath, file.name);
      parentChilds["children"][name] = directoryStructure(newDirPath);
    } else {
      parentChilds["children"][name] = {};
    }
  });
  // console.log(parentChilds);
  return parentChilds;
}
let pathName="./raw";
let structure={}
structure[`${path.basename(pathName)}`] = directoryStructure(pathName);

// specify a name property at root level to display root
tree.setData({
  extended: true,
  children: structure
});
screen.append(tree);
//allow control the table with the keyboard
tree.focus();

screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

screen.render();
