import Head from "next/head";
interface IProps {
    googleAnalyticsID:string;
    googleAdsID:string;
}
export default function GoogleTracker({googleAnalyticsID,googleAdsID}:IProps){
    const stringSrc = "https://www.googletagmanager.com/gtag/js?id=" + googleAnalyticsID;
    return (<Head>
        <script async src={stringSrc}></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                window.dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', {googleAnalyticsID});
            gtag('config', {googleAdsID});
        </script>
    </Head>)
    }