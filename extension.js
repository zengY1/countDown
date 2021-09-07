const vscode = require('vscode');
/**
 * @param {vscode.ExtensionContext} context
 */
var activeStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
var activeTitle = ''
function activate(context) {
	getDate()
	activeStatusBar.show()
}
function getDate() {
	// 当前使用的时间
	let useTime
	let config = vscode.workspace.getConfiguration()
	// 常规时间
	let defalutTime = config.get('countDown.defalutTime')
	// 活动的标题
	activeTitle = config.get('countDown.activeTitle')
	// 特殊星期数
	let specialDay = config.get('countDown.specialDay')
	// 特殊时间
	let specialTime = config.get('countDown.specialTime')
	let specialDayToArray = JSON.parse(specialDay)
	// 今天
	let nowDate = new Date()
	const year = nowDate.getFullYear()
	const momth = nowDate.getMonth() + 1
	const date = nowDate.getDate()
	const today = year + '/' + momth + '/' + date
	// 今天周几
	let week = nowDate.getDay()
	let findIndex = specialDayToArray.findIndex((it) => it === week)
	if (findIndex > -1) {
		useTime = specialTime
	} else {
		useTime = defalutTime
	}
	// 目标的时间戳
	const targetNum = new Date(today + ' ' + useTime + ':00').getTime() / 1000
	// 当前的时间戳
	let nowNum = Math.floor(nowDate.getTime() / 1000)
	// 秒数
	var second = targetNum - nowNum
	if (second > 0) {
		const timer = setInterval(function () {
			formatSeconds(second)
			second--
			if (second === 0) {
				activeStatusBar.text = activeTitle
				vscode.window.showInformationMessage(activeTitle)
				clearInterval(timer)
			}
		}, 1000)
	} else {
		activeStatusBar.text = activeTitle
	}
}
function formatSeconds(value) {
	var second = parseInt(value)
	var minute = 0
	var hour = 0
	if (second > 59) {
		minute = Math.floor(second / 60)
		second = second % 60
		if (minute > 59) {
			hour = Math.floor(minute / 60)
			minute = minute % 60
		}
	}
	const hourTitle = hour > 0 ? `还有${hour}小时` : ''
	const minuteTitle = minute > 0 ? `${minute}分钟` : ''
	activeStatusBar.text = `距离${activeTitle}还有${hourTitle}${minuteTitle}${second}秒`
}

function deactivate() {

}

module.exports = {
	activate,
	deactivate
}
