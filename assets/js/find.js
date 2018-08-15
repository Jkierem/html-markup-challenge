const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN('ramda/0.21.0/ramda.min');
const jquery = CDN('jquery/3.0.0-rc1/jquery.min');
requirejs.config({ paths: { ramda, jquery } });

export default function( str , callback ){
  require(['jquery', 'ramda'], ($, { compose, curry, identity, map, prop }) => {

  const getJSON = curry((callback, url) => $.getJSON(url, callback))

  const host = 'api.flickr.com';
  const path = '/services/feeds/photos_public.gne';
  const query = t => `?tags=${t}&format=json&jsoncallback=?`;
  const url = t => `https://${host}${path}${query(t)}`;

  const generateObjects = (i) => ({ title: extractTitle(i) , url: extractUrl(i) })
  const extractItems = prop("items")
  const extractTitle = prop("title")
  const extractUrl   = compose( prop("m") , prop("media") )
  const mapToObjects = map(generateObjects)
  const getItems = compose( mapToObjects ,  extractItems );

  const generate = compose(callback, getItems);
  const getImagesAsObjects = compose(getJSON(generate), url);
  getImagesAsObjects(str)

});
}
