
function app() {
  let submit = document.getElementById('submitButton')
  let workoutList = [];

  submit.onclick = function() {
    let work = document.getElementById('workout')
    let workSelect = work.options[work.selectedIndex].value

    let workLen = document.getElementById('workoutLength')
    let length = workLen.options[workLen.selectedIndex].value

    let daySelect = document.getElementById('days')
    let days = daySelect.options[daySelect.selectedIndex].value

    if(workSelect == 0 || length == 0 || days == 0) {
      alert('Selections cannot be left blank.')
      return;
    }
      let data = makeObj()
      makeReq(data)
      resetSelectors()
  }

  function makeObj() {
    let work = document.getElementById('workout');
    let workSelect = work.options[work.selectedIndex].value;

    let workLen = document.getElementById('workoutLength');
    let length = workLen.options[workLen.selectedIndex].value;

    let daySelect = document.getElementById('days')
    let days = daySelect.options[daySelect.selectedIndex].value

    let date = createDate()

    let obj = {
      day: days,
      workout: workSelect,
      length: length,
      date: date
    }
    return obj;
  }

  function createDate() {
    let date = new Date();
    let day = date.getDate();

    let month = date.getMonth();
    let matchMonth = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    let year = date.getFullYear();
    let displayDate = matchMonth[month]  + '/' + day + '/' + year;
    return displayDate;
  }

  function resetSelectors() {
    let resetListOne = document.querySelectorAll('#workout option')
    let resetListTwo = document.querySelectorAll('#workoutLength option')
    let resetDay = document.querySelectorAll('#days option')
    for (var ind = 0; ind < resetListOne.length; ind++) {
      resetListOne[ind].selected = resetListOne[ind].defaultSelected;
    }
    for (var ind = 0; ind < resetListTwo.length; ind++) {
      resetListTwo[ind].selected = resetListTwo[ind].defaultSelected;
    }
    for (var ind = 0; ind < resetDay.length; ind++) {
      resetDay[ind].selected = resetDay[ind].defaultSelected;
    }
  }


  function generateList(data) {
    let ul = document.getElementById('dataList');
    ul.innerHTML = ''
    data.forEach(function(ele, ind) {
      let li = document.createElement('li');

      let rem = document.createElement('button')
      let t = document.createTextNode('x')
      rem.appendChild(t)
      li.appendChild(rem)
      rem.className = "remButton";
  

      for(let prop in ele) {
        let item = ele[prop]
        let span = document.createElement('span')
        let val = document.createTextNode(item)
        span.id = 'span'
        prop === 'date' ? span.id = 'propDate' : "";
        prop === 'day' ? span.id = 'propDay' : "";
        prop === 'workout' ? span.id = 'propWorkout' : "";
        prop === 'length' ? span.id = 'propLen' : "";
        span.appendChild(val)
        li.appendChild(span)
      }

      ul.appendChild(li)
      li.className = 'listItem'
      li.className = "list-group-item"

      rem.onclick = function() {
        let removeItem = workoutList[ind]
        removeListItems(removeItem)
        workoutList.splice(ind, 1)
      }
    })
  }

  function addListItem(data) {
    data = data[0]
    let ul = document.getElementById('dataList');
    let li = document.createElement('li');

    let rem = document.createElement('button')
    let t = document.createTextNode('x')
    rem.appendChild(t)
    li.appendChild(rem)
    rem.className = "remButton";


    for(let prop in data) {
      let item = data[prop]
      let span = document.createElement('span')

      let val = document.createTextNode(item)
      span.id = 'span'
      prop === 'date' ? span.id = 'propDate' : "";
      prop === 'day' ? span.id = 'propDay' : "";
      prop === 'workout' ? span.id = 'propWorkout' : "";
      prop === 'length' ? span.id = 'propLen' : "";
      span.appendChild(val)
      li.appendChild(span)
    }

    ul.appendChild(li)
    li.className = 'listItem'
    li.className = "list-group-item"

    workoutList.push(data)
    rem.onclick = function() {
      let removeItem = workoutList[workoutList.length - 1]
      removeListItems(removeItem)
      workoutList.splice(workoutList.length - 1, 1)
    }
  }


  window.onload = function() {
    let params = {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    fetch(`${location.origin}/view`, params)
    .then(res => res.json())
    .then(function(data) {
      if(data.status === false) {
        console.log('ADD SOME KIND OF ERROR');
        return;
      }
      workoutList = data  
      generateList(data)
    })
    .catch(error => console.error('Error GETTING Data:', error))
  }

  function makeReq(data) {
    let params = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    fetch(`${location.origin}/form`, params)
    .then(res => res.json())
    .then(function(data) {
      if(data.status === false) {
        console.log('ADD SOME KIND OF ERROR');
        return;
      }
      addListItem(data)
    })
    .catch(error => console.error('Error POSTING Data:', error))
  }


  function removeListItems(data) {
    let params = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    fetch(`${location.origin}/remove`, params)
    .then(res => res.json())
    .then(function(data) {
      if(data.status === false) {
        console.log('ADD SOME KIND OF ERROR');
        return;
      }
      generateList(data)
    })
    .catch(error => console.error('Error REMOVING/GETTING Data:', error))
  }

}

app()
