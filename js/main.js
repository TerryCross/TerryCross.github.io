
console.log("mainjs, to test fresh, need unregister sws first.");
if('serviceWorker' in navigator) {
    addEventListener(
        "load", async e => {
            console.log("main.js: window loaded");
            await navigator.serviceWorker.register("../sw_cached_pages.js").
                            catch( e => console("error", e));
            console.log("main.js: awaited register of serviceWorker, ../sw_cached_pages.js");
    });
}
