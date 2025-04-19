
// time_calculator/frontend/js/main.js
document.addEventListener('DOMContentLoaded', function () {
  // 暗黑模式切换
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'dark');
  }

  if (localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    themeIcon.textContent = '☀️';
  } else {
    document.documentElement.classList.remove('dark');
    themeIcon.textContent = '🌙';
  }

  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
  });

  // 事件管理功能
  const intermediateEvents = [];
  let targetEvent = null;

  document.getElementById('addTargetEvent').addEventListener('click', function () {
    const name = document.getElementById('targetEventName').value;
    const time = document.getElementById('targetEventTime').value;

    if (!name || !time) {
      alert('请填写完整的事件信息');
      return;
    }

    targetEvent = {
      name,
      time,
      duration: 0,
      unit: 'min'
    };

    // 显示中间事件添加界面
    document.getElementById('targetEventSection').classList.add('hidden');
    document.getElementById('intermediateEventSection').classList.remove('hidden');

    // 更新目标事件摘要
    document.getElementById('summaryTargetName').textContent = name;
    document.getElementById('summaryTargetTime').textContent = formatDateTime(time);

    renderIntermediateEvents();
  });

  document.getElementById('addIntermediateEvent').addEventListener('click', function () {
    const name = document.getElementById('eventName').value;
    const duration = parseInt(document.getElementById('eventDuration').value) || 0;
    const unit = document.getElementById('eventUnit').value;

    if (!name || duration <= 0) {
      alert('请填写完整的中间事件信息');
      return;
    }

    const event = {
      name,
      duration,
      unit
    };

    intermediateEvents.push(event);

    // 清空输入框
    document.getElementById('eventName').value = '';
    document.getElementById('eventDuration').value = '';

    renderIntermediateEvents();
  });

  function renderIntermediateEvents() {
    const container = document.getElementById('intermediateEventsList');

    if (intermediateEvents.length === 0) {
      container.innerHTML = '<div class="text-center text-gray-500 py-4">暂无中间事件，请添加</div>';
      return;
    }

    container.innerHTML = intermediateEvents.map((event, index) => `
            <div class="event-item p-3 rounded-md bg-gray-100 dark:bg-gray-700 flex justify-between items-center" data-index="${index}">
                <div class="flex items-center space-x-2 flex-1">
                    <input type="text" class="edit-name p-1 rounded flex-1 bg-white dark:bg-gray-800" value="${event.name}">
                </div>
                <div class="flex items-center space-x-3">
                    <div class="edit-controls">
                        <input type="number" class="edit-input p-1 rounded" value="${event.duration}" min="1">
                        <select class="edit-unit p-1 rounded">
                            <option value="min" ${event.unit === 'min' ? 'selected' : ''}>分钟</option>
                            <option value="day" ${event.unit === 'day' ? 'selected' : ''}>天</option>
                            <option value="month" ${event.unit === 'month' ? 'selected' : ''}>月</option>
                        </select>
                    </div>
                    <button class="delete-event delete-btn" data-index="${index}">
                        删除
                    </button>
                </div>
            </div>
        `).join('');

    // 添加删除事件监听
    document.querySelectorAll('.delete-event').forEach(button => {
      button.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'));
        intermediateEvents.splice(index, 1);
        renderIntermediateEvents();
      });
    });
  }

  document.getElementById('sortAsc').addEventListener('click', function () {
    if (!targetEvent || intermediateEvents.length === 0) {
      alert('请先添加目标事件和中间事件');
      return;
    }

    generateTimeline(false);
  });

  document.getElementById('sortDesc').addEventListener('click', function () {
    if (!targetEvent || intermediateEvents.length === 0) {
      alert('请先添加目标事件和中间事件');
      return;
    }

    generateTimeline(true);
  });

  document.getElementById('outputEvents').addEventListener('click', function () {
    if (!targetEvent || intermediateEvents.length === 0) {
      alert('请先添加目标事件和中间事件');
      return;
    }

    generateTimeline(false);
  });

  document.getElementById('resetEvents').addEventListener('click', function () {
    intermediateEvents.length = 0;
    renderIntermediateEvents();
    document.getElementById('timelineSection').classList.add('hidden');
  });

  function generateTimeline(isDescending) {
    // 自动更新事件数据，无需手动保存
    document.querySelectorAll('.event-item').forEach((eventItem, index) => {
      const nameInput = eventItem.querySelector('.edit-name');
      const durationInput = eventItem.querySelector('.edit-input');
      const unitSelect = eventItem.querySelector('.edit-unit');

      if (nameInput && durationInput && unitSelect) {
        const newName = nameInput.value.trim();
        const newDuration = parseInt(durationInput.value) || 1;
        const newUnit = unitSelect.value;

        intermediateEvents[index].name = newName || '未命名事件';
        intermediateEvents[index].duration = newDuration;
        intermediateEvents[index].unit = newUnit;
      }
    });

    document.getElementById('timelineSection').classList.remove('hidden');
    document.getElementById('timelineTitle').textContent = isDescending ? '逆序时间安排如下：' : '正序时间安排如下：';

    const targetTime = new Date(targetEvent.time);

    // 创建包含所有事件的数组
    let events = [];

    // 生成一个新的中间事件数组并应用正确的顺序
    // 因为用户输入的是倒序（事件3、事件2、事件1），所以正序时应该反转
    const chronologicalEvents = [...intermediateEvents].reverse();

    // 计算每个中间事件的开始时间点
    let currentTime = new Date(targetTime);

    // 从目标事件时间开始，往前倒推
    for (let i = 0; i < chronologicalEvents.length; i++) {
      const event = chronologicalEvents[i];
      let durationMs = 0;

      // 计算当前事件的持续时间（毫秒）
      switch (event.unit) {
        case 'min':
          durationMs = event.duration * 60 * 1000;
          break;
        case 'day':
          durationMs = event.duration * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          durationMs = event.duration * 30 * 24 * 60 * 60 * 1000;
          break;
      }

      // 当前事件的开始时间 = 下一个事件的开始时间 - 当前事件的持续时间
      currentTime = new Date(currentTime.getTime() - durationMs);
    }

    // 现在 currentTime 是第一个事件的开始时间
    // 从第一个事件开始，往后推算每个事件的开始时间
    let eventsWithTime = [];
    currentTime = new Date(currentTime); // 第一个事件的开始时间

    for (let i = 0; i < chronologicalEvents.length; i++) {
      const event = chronologicalEvents[i];

      // 记录事件的开始时间
      eventsWithTime.push({
        ...event,
        startTime: new Date(currentTime),
        isIntermediate: true
      });

      // 计算下一个事件的开始时间
      let durationMs = 0;
      switch (event.unit) {
        case 'min':
          durationMs = event.duration * 60 * 1000;
          break;
        case 'day':
          durationMs = event.duration * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          durationMs = event.duration * 30 * 24 * 60 * 60 * 1000;
          break;
      }

      // 下一个事件的开始时间 = 当前事件的开始时间 + 当前事件的持续时间
      currentTime = new Date(currentTime.getTime() + durationMs);
    }

    // 添加目标事件
    events = [
      ...eventsWithTime,
      {
        ...targetEvent,
        isTarget: true
      }
    ];

    // 排序规则
    if (isDescending) {
      // 逆序：目标事件 -> 事件3 -> 事件2 -> 事件1
      events.reverse();
    }
    // 正序已经是按时间先后正确排列的：事件1 -> 事件2 -> 事件3 -> 目标事件

    // 渲染时间线
    const container = document.getElementById('timelineEvents');
    container.innerHTML = events.map(event => {
      const timeStr = event.isTarget
        ? formatDateTime(event.time)
        : formatDateTimeFull(event.startTime);

      return `
                <div class="timeline-item">
                    <div class="text-lg font-medium">${event.name}时间点为：${timeStr}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        (时长${event.isTarget ? '0' : event.duration}${event.isTarget ? 'min，预计划的事件正在发生' : getUnitText(event.unit)})
                    </div>
                </div>
            `;
    }).join('');
  }

  // 辅助函数
  function formatDateTime(dateTimeStr) {
    return dateTimeStr.replace('T', ' ');
  }

  function formatDateTimeFull(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function getUnitText(unit) {
    switch (unit) {
      case 'min': return '分钟';
      case 'day': return '天';
      case 'month': return '个月';
      default: return unit;
    }
  }
});
