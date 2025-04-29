// modules/analytics.js
require('dotenv').config();
const { google } = require('googleapis');

const jwtClient = new google.auth.JWT(
  process.env.GA_CLIENT_EMAIL,
  null,
  process.env.GA_PRIVATE_KEY.replace(/\\n/g,'\n'),
  ['https://www.googleapis.com/auth/analytics.readonly']
);
const analytics = google.analyticsreporting('v4');

exports.trackAnalytics = async ()=>{
  try{
    await jwtClient.authorize();
    const res = await analytics.reports.batchGet({
      auth: jwtClient,
      requestBody:{
        reportRequests:[{
          viewId:process.env.GA_VIEW_ID,
          dateRanges:[{startDate:'7daysAgo',endDate:'today'}],
          metrics:[{expression:'ga:sessions'},{expression:'ga:goalCompletionsAll'}]
        }]
      }
    });
    const [sessions,conversions] = res.data.reports[0].data.totals[0].values;
    console.log(`[Analytics] Sessions:${sessions}, Conversions:${conversions}`);
  }catch(e){
    console.error('[Analytics] Err:',e.message);
  }
};
