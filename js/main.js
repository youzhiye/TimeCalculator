jQuery(function ($, undefined) {
  // FIXME: Too bad to extend easily
  $('#addbtn').click(() => {
    addbtn()
  })
  $('#ascOk').click(() => {
    calcTime(1)
  })
  $('#descOk').click(() => {
    calcTime(2)
  })
  $('#resetResult').click(() => {
    location.reload()
  })
})
function checkInput (inputData) {
  if (inputData != '') {
    if (/[^\d]/.test(inputData)) {
      alert('请输入数字')
      return 1
    }
  } else {
    alert('时长不允许为空！')
    return 1
  }
}
function calcTime (type) {
  $('.result').html('')
  // FIXME: Error occurred when no time value is given
  var idLength = $('.add .addevent').length
  var startTime = document.querySelectorAll('h3 .startTime')[0].textContent
  var startTimeNum = new Date(startTime.trim()).getTime()
  if (type == 1) {
    for (let i = 0, j = idLength; i < idLength; i++) {
      startTimeNum = getData(i, startTimeNum)
      $('.result').append(startTimeNum[1])
      startTimeNum = startTimeNum[0]
      j = j - 1
    }
    $('.result').prepend('<b>' + $('.sth').text().trim() + '时间点为：' + $('.startTime').text() + '  (时长0min，预计划的事件正在发生)</b><br>')
  } else {
    for (let i = 0, j = 0; i < idLength; i++) {
      startTimeNum = getData(j, startTimeNum)
      $('.result').prepend(startTimeNum[1])
      startTimeNum = startTimeNum[0]
      j = j + 1
    }
    $('.result').append('<b>' + $('.sth').text().trim() + '时间点为：' + $('.startTime').text() + '  (时长0min，预计划的事件正在发生)</b><br>')
  }
}
function addbtn () {
  var idNum = $('.add .addevent').length
  var selectIdNum = `选择单位<select name="times" id="select${idNum}">`
  var countIdNum = `<div class="addevent"><div class = "count${idNum}">`
  var eventTimeIdNum = `请输入时间<input type="text" id="eventTime${idNum}">`
  var eventNameIdNum = `<label>请输入事件名</label><input type="text" id="eventName${idNum}">`
  var selectType = `<option value="0">day</option><option value="1">hour</option><option value="2"  selected = "selected">min</option><option value="3">second</option></div></div>`
  if (idNum == 0) {
    let sth = $('#sth').val()
    let startTime = $('#startTime').val()
    let startDate = $('#startDate').val()
    $('.mainthing').html(`<h3>您要在 <em class="startTime">${startDate}T${startTime}</em>去 <em class="sth">${sth}</em></h3>`)
    $('.add').append(countIdNum + eventNameIdNum + eventTimeIdNum + selectIdNum + selectType)
  } else {
    let selectorTime = `.add .addevent #eventTime${idNum - 1}`
    let eventTime = $(selectorTime).val()
    if (checkInput(eventTime)) {
      return false
    }
    $('.add').append(countIdNum + eventNameIdNum + eventTimeIdNum + selectIdNum + selectType)
  }
}
function getData (num, startTime) {
  var longtime
  var timeType
  let selectorName = `.add .addevent #eventName${num}`
  let selectorTime = `.add .addevent #eventTime${num}`
  let selectorTimeType = `.add .addevent #select${num}`
  let eventName = $(selectorName).val()
  var eventTime = $(selectorTime).val()
  var eventTimeType = $(selectorTimeType).val()
  switch (eventTimeType) {
    case '0':
      longtime = eventTime * 24 * 60 * 60 * 1000
      timeType = 'day'
      break
    case '1':
      longtime = eventTime * 60 * 60 * 1000
      timeType = 'hour'
      break
    case '2':
      longtime = eventTime * 60 * 1000
      timeType = 'min'
      break
    case '3':
      longtime = eventTime * 1000
      timeType = 'second'
      break
  }
  var endTime = startTime - longtime
  var endTimeUTC = endTime + 8 * 60 * 60 * 1000
  var outputTime = new Date(endTimeUTC).toISOString().slice(0, -5)
  var outputText = `${eventName}时间点为：${outputTime} (时长${eventTime}${timeType})<br>`
  return [endTime, outputText]
}
