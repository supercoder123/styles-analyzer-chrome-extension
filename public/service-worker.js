// chrome.runtime.onConnect.addListener(function(port) {
//     port.onMessage.addListener(function(msg) {
//       console.log(msg)
//     });
//   });

//   function reddenPage() {
//     document.body.style.backgroundColor = 'red';
//   }
  
//   chrome.action.onClicked.addListener((tab) => {
//     console.log('dfd')
//     if (!tab.url.includes('chrome://')) {
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: reddenPage
//       });
//     }
//   });
  
// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.tabs.sendMessage(tabs[0].id, { ...msg, 'worker': true });
//   });

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       console.log(sender.tab ?
//                   "from a content script:" + sender.tab.url :
//                   "from the extension");
//     //   if (request.greeting === "hello")

//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             chrome.tabs.sendMessage(tabs[0].id, { ...request, 'worker': true });
//           });
//         sendResponse(request);
//     }
//   );