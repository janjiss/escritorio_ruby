exports.files = {
  javascripts: { joinTo: 'assets/js/admin.js' },
  stylesheets: { joinTo: 'assets/css/admin.css' }
}

exports.paths = {
  public: 'content/admin',
  watched: [
    "static"
  ]
}

exports.plugins = {
  babel: { presets: ['latest', 'react'] },
  copycat:{
    "assets/images": ["static/images"],
    verbose : true, //shows each file that is copied to the destination directory 
    onlyChanged: true //only copy a file if it's modified time has changed (only effective when using brunch watch) 
  }
};
