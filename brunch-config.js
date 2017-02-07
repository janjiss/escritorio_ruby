module.exports = {
  files: {
    javascripts: { joinTo: 'assets/js/admin.js' },
    stylesheets: { joinTo: 'assets/css/admin.css' }
  },
  paths: {
    public: 'content/admin',
    watched: [
      "static"
    ],
  },
  plugins: {
    babel: {
      presets: ['es2015']
    },
    eslint: {
      pattern: /^static[\\\/].*\.js$/
    }
  }
}
