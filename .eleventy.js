const moment = require("moment");
const fs = require("fs");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRSS);
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addPassthroughCopy("assets/fonts");

  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getFilteredByGlob(["photos/*.md"]);
  });

  eleventyConfig.addFilter("readableDate", dateObj => {
    return moment.utc(dateObj).format("MMMM Do, YYYY");
  });

  eleventyConfig.addFilter('machineReadableDate', (dateObj) => {
    return moment.utc(dateObj).format("YYYY-MM-DD");
  });

  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404/index.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // You can also pass this in on the command line using `--pathprefix`

    // pathPrefix: "/",

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
