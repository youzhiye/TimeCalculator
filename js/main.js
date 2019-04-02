jQuery(function ($, undefined) {
    //FIXME: Too bad to extend easily
    $('#addbtn').click(() => {
        var idNum = $('.add .addevent').length;
        $('.add').append('<div class="addevent"><div class = "count' + idNum + '"><label>请输入事件名</label><input type="text" id="eventName' 
          + idNum + '">请输入时间<input type="text" id="eventTime' + idNum + '">选择单位<select name="times" id="select' 
          + idNum + '"><option value="0">day</option><option value="1">hour</option><option value="2">min</option><option value="3">second</option></div></div>');
        if (idNum == 0) {
            let sth = $('#sth').val();
            let startTime = $('#startTime').val();
            let startDate = $('#startDate').val();
            $('.mainthing').html('<h3>您要在 <em class="startTime">' + startDate + 'T' + startTime + ' </em>去 <em class="sth">' + sth + ' </em></h3>')
        }
    })
    function getData(num, startTime) {
        var longtime;
        var timeType;
        let selectorName = '.add .addevent #eventName' + num;
        let selectorTime = '.add .addevent #eventTime' + num;
        let selectorCount = '.add .addevent .count' + num;
        let selectorTimeType = '.add .addevent #select' + num;
        let eventName = $(selectorName).val();
        var eventTime = $(selectorTime).val();
        var eventTimeType = $(selectorTimeType).val();
        switch (eventTimeType) {
            case '0':
                longtime = eventTime * 24 * 60 * 60 * 1000;
                timeType = 'day';
                break;
            case '1':
                longtime = eventTime * 60 * 60 * 1000;
                timeType = 'hour';
                break;
            case '2':
                longtime = eventTime * 60 * 1000;
                timeType = 'min';
                break;
            case '3':
                longtime = eventTime * 1000;
                timeType = 'second';
                break;
        }
        var endTime = startTime - longtime;
        var endTimeUTC = endTime + 8 * 60 * 60 * 1000;
        $('.result').prepend(num + 1 + '. ' + eventName + '时间点为：' + new Date(endTimeUTC).toISOString().slice(0, -5) + '  (时长' + eventTime + timeType + ')<br>');
        return endTime;
        //$(selectorCount).html(num+1+'. '+eventName+'时间点为：'+eventTime + ' (时长'+eventTime+')')
    }
    $('#ok').click(() => {
        var idLength = $('.add .addevent').length;
        var startTime = document.querySelectorAll('h3 .startTime')[0].textContent;
        var startTimeNum = new Date(startTime.trim()).getTime();
        for (let i = 0, j = idLength; i < idLength; i++) {
            startTimeNum = getData(j - 1, startTimeNum);
            j = j - 1;
        }
        $('.result').append(idLength+1 + '. '+ $('.sth').text().trim() +'时间点为：' + $('.startTime').text() + '  (时长0min，预计划的事件正在发生)<br>');
    })
    $('#resetResult').click(()=>{
        //FIXME: Too bad to extend easily
        $('.add .addevent').length  = 0;
        $('.add').remove();
        $('.mainthing').html('');
        $('.mainthing').append('<label>请输入要做的事情</label><input type="text" id="sth" name="sth" placeholder="看电影?">' 
          + '<label>请输入事情开始时间</label><input type="date" id="startDate" name="date"><input type="time" id="startTime" name="time">');
        $('.result').html('');
    })
})
