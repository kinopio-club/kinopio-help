import { HtmlBasePlugin } from "@11ty/eleventy";
import pugPlugin from "@11ty/eleventy-plugin-pug";
import sitemap from "@quasibit/eleventy-plugin-sitemap";

export default function(config) {
  config.addPassthroughCopy("./assets")
  config.setQuietMode(true)
  
  config.addPlugin(HtmlBasePlugin);
  config.addPlugin(pugPlugin);
	
  config.addPlugin(sitemap, {
      sitemap: {
        hostname: "https://kinopio.club",
      },
  });
  
  config.addCollection("sitemap", (collectionApi) => {
    return collectionApi
      .getAll()
      .map((item, index, all) => {
        item.url = "/help" + item.url;
        return item;
      });
  });

  // https://www.11ty.dev/docs/collections/#collection-api-methods
  config.addCollection("alphabeticallySorted", collectionApi => {
    const posts = collectionApi.getAll()
    let titles = posts.map(post => {
      return post.data.title
    })
    titles = titles.sort()
    const collection = titles.map(title => {
      return posts.find(post => post.data.title === title)
    })
    return collection
  })

  config.addCollection("dateSorted", function(collectionApi) {
    return collectionApi.getAll().sort(function (a, b) {
      return a.date - b.date; // sort by date - ascending
      // return b.date - a.date; // sort by date - descending
    })
  });
}

export let config = {
  templateFormats: [
  	  "md",
      "css",
      "njk",
    ],
    pathPrefix: "/help/"
}
