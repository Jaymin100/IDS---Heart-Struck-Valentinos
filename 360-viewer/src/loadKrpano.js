const KRPANO_VIEWER_TARGET_ID = "krpano-target";
const KRPANO_VIEWER_ID = "krpano-viewer";

const loadKrpano = () => {
  return new Promise((resolve, reject) => {
    let xmlStr;

    function onKRPanoReady(krpano) {
      try {
        krpano.call(`loadxml(${xmlStr})`);
        resolve(krpano); // Resolve with the krpano object
      } catch (err) {
        console.error("Error loading krpano xml", err);
        reject(err);
      }
    }

    function onKRPanoError(err) {
      console.error("Error embedding krpano", err);
      // eslint-disable-next-line no-undef
      removepano(KRPANO_VIEWER_ID);
      const target = document.getElementById(KRPANO_VIEWER_TARGET_ID);
      target?.remove();
      reject(err);
    }

    fetch("https://api.viewer.immersiondata.com/api/v1/panoramas/311975/krpano.xml")
      .then((res) => res.text())
      .then((xml) => {
        xmlStr = xml;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        const nadirHotspotElem = xmlDoc.querySelector("hotspot[name='nadirlogo']");
        nadirHotspotElem?.setAttribute('url', './ids-nadir.png');
        const serializer = new XMLSerializer();
        xmlStr = serializer.serializeToString(xmlDoc);
        // eslint-disable-next-line no-undef
        embedpano({
          xml: null,
          html5: "prefer",
          consolelog: true,
          capturetouch: false,
          bgcolor: "#F4F6F8",
          id: KRPANO_VIEWER_ID,
          target: KRPANO_VIEWER_TARGET_ID,
          onready: onKRPanoReady,
          onerror: onKRPanoError,
        });
      })
      .catch(reject);
  });
};

export default loadKrpano;