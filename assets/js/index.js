const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN('ramda/0.21.0/ramda.min');
requirejs.config({ paths: { ramda } });

require(["ramda"] , actualScript);

actualScript( { curry , prop , map , addIndex } ){

  const getElemsWithClass = (className) => () => Array.from(document.getElementsByClassName(className))
  const getDots = getElemsWithClass("carousel__pager__dot");
  const getDotIndex = (obj) => obj.getAttribute('data-index')

  const getTarget = prop('target');
  const addListener = curry((event,callback,obj) => obj.addEventListener(event,callback))

  const addClass = curry((className,obj) => obj.classList.add(className))
  const removeClass = curry((className,obj) => obj.classList.remove(className))

  const activateCarouselItem = addClass('carousel__item--hidden')
  const deactivateCarouselItem = removeClass('carousel__item--hidden')

  const activateDot = addClass("carousel__pager__dot--active")
  const deactivateDot = removeClass("carousel__pager__dot--active")

  const mapIndexed = addIndex(map)
  const checkDot = ( dot , index , currentDot )
  const mapDots = (i) = mapIndexed(( dot , index ) => i === index ? activateDot(dot) : deactivateDot(dot) )
  const activateCurrentDot = (i) =>
  const activateCurrentImg = (i) => mapIndexed(( img , index ) => i === index ? activateCarouselItem(img) : deactivateCarouselItem(img) )

  const callback = (e) => {
    activateCurrentDot(getDotIndex(getTarget(e)));
  }

  const addPageSwitchOnClick = addListener('click', compose( activateCurrentDot , ))

}
