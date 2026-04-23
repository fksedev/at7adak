import { createDispatcher } from '../../utils/event'
import { getDistance } from '../../utils/math'
import {
  addFocusinEventListener,
  removeFocusinEventListener,
  addFocusoutEventListener,
  removeFocusoutEventListener,
} from './event'

/**
 * tappable events are for touchable devices only
 */
export function tappable(node: HTMLElement) {
  const dispatch = createDispatcher(node)

  let tapStartedAt = 0
  let tapStartPos = { x: 0, y: 0 }

  function getIsValidTap({
    tapEndedAt,
    tapEndedPos
  }) {
    const tapTime = tapEndedAt - tapStartedAt
    const tapDist = getDistance(tapStartPos, tapEndedPos)
    return (
      // tapTime <= 110 &&
      tapDist <= 6
    )
  }

  function handleTapstart(event) {
    tapStartedAt = Date.now()

    const touch = event.touches[0]
    tapStartPos = { x: touch.clientX, y: touch.clientY }

    addFocusoutEventListener(node, handleTapend)
  }

  function handleTapend(event) {
    removeFocusoutEventListener(node, handleTapend)

    const touch = event.changedTouches[0]
    if (getIsValidTap({
      tapEndedAt: Date.now(),
      tapEndedPos: { x: touch.clientX, y: touch.clientY }
    })) {
      dispatch('tapped', true)
    }
  }

  addFocusinEventListener(node, handleTapstart)

  let clickStartedAt = 0
  let clickStartPos = { x: 0, y: 0 }

  function getIsValidClick({
    clickEndedAt,
    clickEndedPos
  }) {
    const clickTime = clickEndedAt - clickStartedAt
    const clickDist = getDistance(clickStartPos, clickEndedPos)
    return (
      // clickTime <= 110 &&
      clickDist <= 6
    )
  }

  function handleMouseStart(event){
    clickStartedAt = Date.now()
    clickStartPos = { x: event.pageX, y: event.pageY }
    node.addEventListener('mouseup', handleMouseEnd)
  }

  function handleMouseEnd(event){
    node.removeEventListener('mouseup', handleMouseEnd)
    if(getIsValidClick({
      clickEndedAt: Date.now(),
      clickEndedPos: { x: event.pageX, y: event.pageY }
    })) {
      dispatch('tapped', true)
    }
  }

  node.addEventListener('mousedown', handleMouseStart)
  
  return {
    destroy() {
      removeFocusinEventListener(node, handleTapstart)
      removeFocusoutEventListener(node, handleTapend)

      node.removeEventListener('mousedown', handleMouseStart)
      node.removeEventListener('mouseup', handleMouseEnd)
    },
  }
}
