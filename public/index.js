
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
      date: date,    
      workout: workSelect,
      length: length,
      
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
        workoutList.splice(ind, 1)
        removeListItems(workoutList)
        li.parentNode.removeChild(li);
      }
    })
  }

  function addListItem(data) {
    data = data[data.length -1]
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
      li.className = 'listItem';
      li.className = "list-group-item";
      
    workoutList.forEach((ele, ind) => {
      rem.onclick = function() {
        workoutList.splice(ind, 1)
        removeListItems(workoutList)
        li.parentNode.removeChild(li);
      }
    })
  }


  window.onload = function() {
    let auth = verifyAuth()
    let params = {
      method: 'get',
      headers: {
        'x-access-token': auth.token,
        'x-access-user': auth.user,
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
      workoutList = data;  
      generateList(data)
    })
    .catch(error => console.error('Error GETTING Data:', error))
  }

  function makeReq(data) {
    let auth = verifyAuth()
    let params = {
      method: 'post',
      headers: {
        'x-access-token': auth.token,
        'x-access-user': auth.user,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    fetch(`${location.origin}/update`, params)
    .then(res => res.json())
    .then(function(data) {
      workoutList = data.profile;  
      addListItem(data.profile)
      user(data.userName)
    })
    .catch(error => console.error('Error POSTING Data:', error))
  }


  function removeListItems(data) {
    let auth = verifyAuth()
    let params = {
      method: 'post',
      headers: {
        'x-access-token': auth.token,
        'x-access-user': auth.user,
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
    })
    .catch(error => console.error('Error REMOVING Data:', error))
  }

}

app()


function verifyAuth() {
  let token = localStorage.getItem('key')
  let userName = localStorage.getItem('userName')
  token = token ? JSON.parse(token) : '' ;
  userName = userName ? JSON.parse(userName) : '';   
 return {token: token, user: userName}
}

function user(user) {
  localStorage.setItem('userName', JSON.stringify(user))  
}
