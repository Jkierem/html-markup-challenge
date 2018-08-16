const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN('ramda/0.21.0/ramda.min');
requirejs.config({ paths: { ramda } });

require(["ramda"] , actualScript);

function actualScript( { curry , prop , map , addIndex , compose , forEach } ){

  const createManager = () => {
    let current = 0
    return {
      next: function(){ current = (current + 1) % 3 },
      prev: function(){ current = (current - 1)  < 0 ? 2 : current - 1},
      getCurrent: function(){ return current },
      setCurrent: function(c){ current = c }
    }
  }
  const manager = createManager();

  const getElemsWithClass = (className) => () => Array.from(document.getElementsByClassName(className))
  const getArrows = getElemsWithClass("carousel__control__button")
  const getCaps   = getElemsWithClass("carousel__captions__item")
  const getDots   = getElemsWithClass("carousel__pager__dot")
  const getImgs   = getElemsWithClass("carousel__item")
  const addListener = curry((event,callback,obj) => obj.addEventListener(event,callback))

  const getArrowData = (obj) => obj.getAttribute('data-action')
  const getDotIndex = (obj) => obj.getAttribute('data-index')
  const getTarget = prop('target');
  const getTargetIndex = compose( getDotIndex  , getTarget );
  const getArrowAction = compose( getArrowData , getTarget );

  const addClass = curry((className,obj) => obj.classList.add(className))
  const removeClass = curry((className,obj) => obj.classList.remove(className))

  const activateImg = addClass('carousel__item--active')
  const deactivateImg = removeClass('carousel__item--active')

  const activateDot = addClass("carousel__pager__dot--active")
  const deactivateDot = removeClass("carousel__pager__dot--active")

  const activateCap = addClass("carousel__captions__item--active")
  const deactivateCap = removeClass("carousel__captions__item--active");

  const mapIndexed = addIndex(map)
  const dotMapping = (i) => ( dot , index ) => i == index ? activateDot(dot) : deactivateDot(dot)
  const imgMapping = (i) => ( img , index ) => i == index ? activateImg(img) : deactivateImg(img)
  const capMapping = (i) => ( cap , index ) => i == index ? activateCap(cap) : deactivateCap(cap)

  const setDots = (i) => compose( mapIndexed(dotMapping(i)) , getDots )()
  const setImgs = (i) => compose( mapIndexed(imgMapping(i)) , getImgs )()
  const setCaps = (i) => compose( mapIndexed(capMapping(i)) , getCaps )()

  const refreshPage = (man) => {
    setDots(man.getCurrent())
    setImgs(man.getCurrent())
    setCaps(man.getCurrent())
  }

  const handleArrowClick = curry((man,e) => {
    prop(getArrowAction(e))(man)()
    refreshPage(man)
  })

  const handleDotClick = curry((man,e) => {
    man.setCurrent(getTargetIndex(e));
    refreshPage(man)
  })

  const addHandleArrowClick = addListener('click', handleArrowClick(manager))
  const addHandleDotClick = addListener('click', handleDotClick(manager))

  const addEventToArrows = compose( map(addHandleArrowClick) , getArrows )
  const addEventToDots = compose( map(addHandleDotClick) , getDots )

  addEventToArrows();
  addEventToDots();
}
