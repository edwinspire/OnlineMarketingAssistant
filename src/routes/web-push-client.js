import { Geolocation } from "@edwinspire/Geolocation.js";
const WEBPUSH_PUBLICK =
  "BNi_4RFjAjaObFkgSvt3TSwUGg1cAO9aGiZlglXexl-U8U8zrqeOrUJR9nMRa6X2p4ECzk7XAivknIp1AMyIYfY";

// I have found this code (or variations of) from; multiple sources
// but I could not find the original author
// here's one such source:
// https://stackoverflow.com/questions/42362235/web-pushnotification-unauthorizedregistration-or-gone-or-unauthorized-sub
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export async function registration() {
  if ("serviceWorker" in navigator) {
    console.log(navigator.serviceWorker);
    // We first get the registration
    const registration = await navigator.serviceWorker.ready;
    // Asking for the subscription object
    let subscription = await registration.pushManager.getSubscription();
    console.log(subscription);
    // If we don't have a subscription we have to create and register it!
    //if (!subscription) {
    subscription = await subscribe(registration);
    //}
    // Implementing an unsubscribe button
    //document.getElementById('unsubscribe').onclick = () => unsubscribe();
  } else {
    console.log("serviceWorker Unsoported");
  }
}

// We use this function to subscribe to our push notifications
// As soon as you run this code once, it shouldn't run again if the initial subscription went well
// Except if you clear your storage
const subscribe = async (registration) => {
  // this is an annoying part of the process we have to turn our public key
  // into a Uint8Array
  const Uint8ArrayPublicKey = urlBase64ToUint8Array(WEBPUSH_PUBLICK);

  // registering a new subscription to our service worker's Push manager
  const subscription = await registration.pushManager.subscribe({
    // don't worry about the userVisible only atm
    userVisibleOnly: true,
    applicationServerKey: Uint8ArrayPublicKey,
  });

  var GL = new Geolocation();
  let position = await GL.getCurrentPosition();
  await SendSubscription(subscription, position);
  return subscription;
};

function SendSubscription(subscription, geo) {
  let data = {
    subscription: subscription.toJSON(),
    geolocation: geo,
  };
  console.log(data);
  // Sending the subscription object to our Express server
  return fetch("/webpush-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
