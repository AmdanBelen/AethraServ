var Wiki = require('../models/wiki');
var Markdown = require('markdown').markdown;


// Load a file, parse the title and generate the HTML
exports.loadPage = function (name, callback) {
  var exists= false;
  Wiki.findOne({ 'page' :  name }, function(err, wik) {
    if (err){
        return callback(err);
    }
    if (wik) {
      exists=true;
      markdown=Wiki.text;
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
    });
  });
};

// Saving is simple.  Just put the markdown in the file
exports.savePage = function (name, value, callback) {
  Wiki.findOne({ 'page' :  name }, function(err, wik) {
    if (err){
        return done(err);
    }
    if (wik) {
        Wiki.page = name;
        Wiki.text = value;
        Wiki.save();
        //}else return done(null, false, req.flash('message', 'User exists, use edit'));  
    } else {
        var newWiki = new Wiki();
        newWiki.page = name;
        newWiki.text = value;

        newWiki.save(function(err) {
            if (err){
                throw err;  
            } 
            return done(null, newWiki);
        });
    }
  });
};