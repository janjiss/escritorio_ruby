module.exports = {
  files: {
    javascripts: { joinTo: 'js/admin.js' },
    stylesheets: { joinTo: 'css/admin.css' }
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
