var Wiki = require('../models/wiki');
var Markdown = require('markdown').markdown;
//var MDE = require('bootstrap-markdown');



// Load a file, parse the title and generate the HTML
exports.loadPage = function (name, callback) {
  var exists= false;
  Wiki.findOne({ 'page' :  name }, function(err, wik) {
    if (err){
        return callback(err);
    }
    if (wik) {
      exists=true;
      markdown=wik.text;
    }else{
      markdown = "# " + name.replace(/_/g, " ") +"\n\n" + "This page does not exist yet.";
    }
    var tree = Markdown.parse(markdown);
    var title = name;
    for (var i = 1, l = tree.length; i < l; i++) {
      if (tree[i] && tree[i][0] === "header") {
        title = tree[i][2];
        tree.splice(i, 1);
        break;
      }
    }
    var html = Markdown.toHTML(tree);

    callback(null, {
      name: name,
      title: title,
      exists: exists,
      markdown: markdown,
      html: html,
      MDE: MDE,
    });
  });
};

// Saving is simple.  Just put the markdown in the file
exports.savePage = function (name, value, callback) {
  Wiki.findOne({ 'page' :  name }, function(err, wik) {
    if (err){
      callback(err);  
    }
    if (wik) {
        //Wiki.page = name;
        wik.text = value;
        wik.save();
        //}else return done(null, false, req.flash('message', 'User exists, use edit'));  
    } else {
        var newWiki = new Wiki();
        newWiki.page = name;
        newWiki.text = value;

        newWiki.save(function(err) {
            if (err){
                callback(err);
            }
        });
    }
    callback(err);
  });
};