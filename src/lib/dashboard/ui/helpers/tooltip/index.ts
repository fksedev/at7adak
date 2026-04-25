// https://github.com/untemps/svelte-use-tooltip

import Tooltip from './Tooltip'
import './useTooltip.css'

interface IOptions {
	content?: string,
	position?: 'top' | 'bottom' | 'left' | 'right',
	animated?: boolean,
	contentSelector?: string,
	contentActions?: any,
	containerClassName?: string,
	animationEnterClassName?: string,
	animationLeaveClassName?: string,
	enterDelay?: number,
	leaveDelay?: number,
	onEnter?: any,
	onLeave?: any,
	offset?: number,
	disabled?: boolean,
}

export const useTooltip = (
	node,
	{
		content,
		contentSelector,
		contentActions,
		containerClassName,
		position,
		animated = true,
		animationEnterClassName,
		animationLeaveClassName,
		enterDelay = 30,
		leaveDelay = 30,
		onEnter,
		onLeave,
		offset,
		disabled,
	}: IOptions
) => {
	const tooltip = new Tooltip(
		node,
		content,
		contentSelector,
		contentActions,
		containerClassName,
		position,
		animated,
		animationEnterClassName,
		animationLeaveClassName,
		enterDelay,
		leaveDelay,
		onEnter,
		onLeave,
		offset,
		disabled
	)

	return {
		update: ({
			content: newContent,
			contentSelector: newContentSelector,
			contentActions: newContentActions,
			containerClassName: newContainerClassName,
			position: newPosition,
			animated: newAnimated,
			animationEnterClassName: newAnimationEnterClassName,
			animationLeaveClassName: newAnimationLeaveClassName,
			enterDelay: newEnterDelay,
			leaveDelay: newLeaveDelay,
			onEnter: newOnEnter,
			onLeave: newOnLeave,
			offset: newOffset,
			disabled: newDisabled,
		}) =>
			tooltip.update(
				newContent,
				newContentSelector,
				newContentActions,
				newContainerClassName,
				newPosition,
				newAnimated,
				newAnimationEnterClassName,
				newAnimationLeaveClassName,
				newEnterDelay,
				newLeaveDelay,
				newOnEnter,
				newOnLeave,
				newOffset,
				newDisabled
			),
		destroy: () => tooltip.destroy(),
	}
}
