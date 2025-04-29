// modules/seo.js
const { askAI } = require('../rae');
exports.updateSEOContent = async ()=>{
  const article = await askAI('Write a 300-word SEO article on book publishing tips.');
  console.log('[SEO] Excerpt:',article.slice(0,100)+'…');
};
