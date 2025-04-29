// modules/products.js
const LINKS = [
    "https://www.solvarispublishing.com",
    "https://www.amazon.com/dp/B0DV2XKYJN",
    "https://paypal.me/YourRealLink",
    "https://cash.app/$YourRealTag"
  ];
  exports.simulateEarnings = ()=> {
    const amt = Math.floor(Math.random()*300)+100;
    console.log(`[EARN] +$${amt}`);
  };
  
  exports.triggerSale = ()=> {
    const link = LINKS.shift(); LINKS.push(link);
    console.log(`[SALE] Drive traffic: ${link}`);
  };
  
  exports.dynamicPost = async ()=> {
    const prompt = `Write a 280-char social post promoting ${LINKS[0]}.`;
    const res    = await openaiClient.chat.completions.create({
      model:'gpt-3.5-turbo',
      messages:[{role:'user',content:prompt}]
    });
    console.log('[POST]',res.choices[0].message.content);
  };