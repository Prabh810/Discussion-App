var submitQuestionNode = document.getElementById("submitBtn"); 
var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var allQuestionsListNode = document.getElementById("dataList");
var createQuestionFormNode = document.getElementById("toggleDisplay");
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionContainerNode = document.getElementById("resolveHolder");
var resolveQuestionNode = document.getElementById("resolveQuestion");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var questionSearchNode = document.getElementById("questionSearch");
var upvote = document.getElementById("upvote");
var downvote = document.getElementById("downvote");
var resolveQuestionButton = document.getElementById("resolveQuestion");

var toggleDisplayDiv = document.getElementById("toggleDisplay");

var newQuestionForm = document.getElementById("newQuestionForm");


//on new Question form click
newQuestionForm.addEventListener("click", function(){
  hideRightContainerFromUI();
  showRightContainerOnUI();
});

//listen to value change
questionSearchNode.addEventListener("keyup", function(event){

  // show filtered result
  filterResult(event.target.value);

})

  // filter result
function filterResult(query){

  var allQuestions = getAllQuestions();

  if(query){
    clearQuestionPanel();

     var filteredQuestions = allQuestions.filter(function(question){
      if(question.title.includes(query)){
        return true;
      }
  })
  if(filteredQuestions.length){
      filteredQuestions.forEach(function(question){
        addQuestionToPanel(question);
      })
  }
  else{
      printNoMatchFound();
  }

  } else {
    clearQuestionPanel();
    allQuestions.forEach(function(question){
    
      addQuestionToPanel(question);
    
  })
  }
}

// clear all questions 
function clearQuestionPanel(){
  allQuestionsListNode.innerHTML = "";
}

// display all exixting questions
function onLoad()
{
  // get all queations from storage
  var allQuestions = getAllQuestions();

  allQuestions = allQuestions.sort(function(currentQ)
  {
    if(currentQ.isFav)
    {
      return -1;
    }
    
    return 1;
  })

  allQuestions.forEach(function(question)
  {
    addQuestionToPanel(question)
  })
}

onLoad();

// listen for the submit button to create question
submitQuestionNode.addEventListener("click", onQuestionSubmit);

function onQuestionSubmit(){

  question = {
    title: questionTitleNode.value,
    description: questionDescriptionNode.value,
    responses: [],
    upvotes: 0,
    downvotes: 0,
    createdAt: Date.now(),
    isFav: false
  };

  saveQuestion(question);
  addQuestionToPanel(question);
  clearQuestion();
}

// save question to the storage
function saveQuestion(question){

  //get all questions first and push the new question and then store again 
  // in storage

  var allQuestions = getAllQuestions();
  allQuestions.push(question);
  localStorage.setItem("questions", JSON.stringify(allQuestions));
}

// get all questions from local storage

function getAllQuestions(){
  var allQuestions = localStorage.getItem("questions");
  if(allQuestions){
    allQuestions = JSON.parse(allQuestions);
  } else {
    allQuestions = [];
  }
  return allQuestions;
}


// append question to the left panel

function addQuestionToPanel(question){

  var questionContainer = document.createElement("div");
  questionContainer.setAttribute("id", question.title);
  questionContainer.style.background = "#0069d9";

  var newQuestionTitleNode = document.createElement("h3");
  newQuestionTitleNode.innerHTML = question.title;

  var newQuestionDescriptionNode = document.createElement("p");
  newQuestionDescriptionNode.innerHTML = question.description;

  questionContainer.appendChild(newQuestionTitleNode);
  questionContainer.appendChild(newQuestionDescriptionNode);

  var upvoteNode = document.createElement("h4");
  upvoteNode.innerHTML = "upvote = " + question.upvotes;

  var upvotTextNode = document.createElement("h4");
  upvotTextNode.innerHTML = "upvote = " + question.upvotes;
  questionContainer.appendChild(upvotTextNode);

  var downvoteTextNode = document.createElement("h4");
  downvoteTextNode.innerHTML = "downvote = " + question.downvotes;
  questionContainer.appendChild(downvoteTextNode);

  var createAtNode = document.createElement("p");
  createAtNode.innerHTML = "created:" + updateAndConvertTime(createAtNode)(question.createdAt) + " ago";
  questionContainer.appendChild(createAtNode);

  var addToFavNode = document.createElement("button");
  addToFavNode.style.background = "teal";
  
  if(question.isFav)
  {
    addToFavNode.innerHTML = "remove fav"
  }
  else
  {
    addToFavNode.innerHTML = "add fav"
  }
  
  questionContainer.appendChild(addToFavNode);

  addToFavNode.addEventListener("click", toggleFavQuestion(question));

  allQuestionsListNode.appendChild(questionContainer);

  questionContainer.addEventListener("click",onQuestionClick(question))

}

function toggleFavQuestion(question)
{
  return function(event)
  {
    event.stopPropagation();
    question.isFav = !question.isFav;
    
    updateQuestion(question);

    if(question.isFav)
    {
      event.target.innerHTML = "remove fav"
    }
    else
    {
      event.target.innerHTML = "add fav"
    }

  }
}

// setInterval and update time
function updateAndConvertTime(element)
{
  return function(time)
  {
    setInterval(function()
    {
      element.innerHTML = "created: "+convertDateToCreatedAtTime(time)+" ago";
    })

    return convertDateToCreatedAtTime(time);
  }
}

//convert date to hours ago like format
function convertDateToCreatedAtTime(date){
  
  var currentTime = Date.now();
  var timeLapsed = currentTime - new Date(date).getTime();

  var secondsDiff = parseInt(timeLapsed / 1000 );
  var minutesDiff = parseInt(secondsDiff / 60 );
  var hourDiff = parseInt(minutesDiff / 60 );
  var day = parseInt(hourDiff / 24);

  if (day === 0 && hourDiff === 0 && minutesDiff === 0){
    return (secondsDiff % 60) +" Seconds";
  } else if (day === 0 && hourDiff === 0){
    return (minutesDiff % 60) +" minutes " + (secondsDiff % 60) +" Seconds";
  } else if (day === 0){
    return (hourDiff % 24)  +" hours "+ (minutesDiff % 60) +" minutes " + (secondsDiff % 60) +" Seconds";
  } else{
    return day + " Days " + (hourDiff % 24)  +" hours "+ (minutesDiff % 60) +" minutes " + (secondsDiff % 60) +" Seconds";
  }
  
  

  //return day + " Days " + (hourDiff % 24)  +" hours "+ (minutesDiff % 60) +" minutes " + (secondsDiff % 60) +" Seconds";
 
}

// clear question form

function clearQuestion(){
  questionTitleNode.value = "";
  questionDescriptionNode.value = "";
}

// listen for click on question and display in right pane
function onQuestionClick(question){

  return function(){
    // we can access question variable due to clouser
    // hide question panel
    hideQuestionPanel();

    // clear last details
    clearQuestionDetails();
    clearResponsePanel();

    // show clicked question
    showDetails();

    // create questions details
    addQuestionToRight(question);

    // show all previous responses
    var responseNode = document.createElement("h1");
    responseNode.innerHTML = "Responses";
    responseContainerNode.appendChild(responseNode);

    question.responses.forEach(function(response){
      addResponseInPanel(response);
    })

    //listen for response submit
    submitCommentNode.onclick = onResponseSubmit(question);
    upvote.onclick = upvoteQuestion(question);
    downvote.onclick = downvoteQuestion(question);
    resolveQuestionButton.onclick = resolveQuestion(question);

  }
}

// upvotes
function upvoteQuestion(question){
    return function(){
        question.upvotes++;
        updateQuestion(question);
        updateQuestionUI(question);
    }

}

//downvotes

function downvoteQuestion(question){
    return function(){
        question.downvotes++;
        updateQuestion(question);
        updateQuestionUI(question);
    }

}

// resolve question form from the left panel

function resolveQuestion(question){
  return function(){
    hideRightContainerFromUI();
    showRightContainerOnUI();
    deleteQuestionForm(question);
    deleteFromUI(question);
  }
}

// show container on UI
function showRightContainerOnUI(){
  createQuestionFormNode.style.display = "block";
}

// hide right container from UI
function hideRightContainerFromUI(){
  questionDetailContainerNode.style.display = "none";
  resolveQuestionContainerNode.style.display = "none";
  responseContainerNode.style.display = "none";
  commentContainerNode.style.display = "none";

}


// delete question form from local storage

function deleteQuestionForm(question){
  allQuestions = getAllQuestions();
  allQuestions.forEach(function(data, index, array){
    if (data.title == question.title){
      array.splice(index, 1)
    }
  })
  localStorage.setItem("questions", JSON.stringify(allQuestions));
}


// delete from UI
function deleteFromUI(question){
  var childNode = document.getElementById(question.title);
  var parent = childNode.parentNode
  parent.removeChild(childNode);
  console.log(childNode);
}

//update question UI

function updateQuestionUI(question){
    // get question container from DOM
    var questionContainerNode = document.getElementById(question.title);
    questionContainerNode.childNodes[2].innerHTML = "upvote = " + question.upvotes;
    questionContainerNode.childNodes[3].innerHTML = "downvote = " + question.downvotes;

}

// listen for click on submit response button
function onResponseSubmit(question){
  return function()
  {
    

    var response = {
        name: commentatorNameNode.value,
        description: commentNode.value
    }
    question.responses.push(response)

    saveResponse(question, response);

    addResponseInPanel(response)
    commentatorNameNode.value="";
    commentNode.value="";
  }
}



//display response in response section
function addResponseInPanel(response){
  // var responseNode = document.createElement("h1");
  // responseNode.innerHTML = "Responses";

  var userNameNode = document.createElement("h4");
  userNameNode.innerHTML = response.name;

  var userCommentNode = document.createElement("p");
  userCommentNode.innerHTML = response.description;

  var container = document.createElement("div");

  //container.appendChild(responseNode);
  container.appendChild(userNameNode);
  container.appendChild(userCommentNode);

  responseContainerNode.appendChild(container);
}


// hide question panel
function hideQuestionPanel(){
  createQuestionFormNode.style.display = "none";
}

// display question Details
function showDetails(){
  questionDetailContainerNode.style.display = "block";
  resolveQuestionContainerNode.style.display = "block";
  responseContainerNode.style.display = "block";
  commentContainerNode.style.display = "block";

}


// show function details
function addQuestionToRight(question){
  var questionNode = document.createElement("h1");
  questionNode.innerHTML = "Question";
  var titleNode = document.createElement("h3");
  titleNode.innerHTML = question.title;

  var descriptionNode = document.createElement("p")
  descriptionNode.innerHTML = question.description;

  questionDetailContainerNode.appendChild(questionNode);
  questionDetailContainerNode.appendChild(titleNode);
  questionDetailContainerNode.appendChild(descriptionNode);

}

// update question
function updateQuestion(updatedQuestion){
    var allQuestions = getAllQuestions();

    var revisedQuestions = allQuestions.map(function(question)
  {
    if( updatedQuestion.title  === question.title)
    {
      return updatedQuestion;
    }

    return question;
  })

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

function saveResponse(updatedQuestion, response)
{
  var allQuestions = getAllQuestions();

  var revisedQuestions = allQuestions.map(function(question)
  {
    if( updatedQuestion.title  === question.title)
    {
      question.responses.push(response)
    }

    return question;
  })

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

function clearQuestionDetails(){
  questionDetailContainerNode.innerHTML = "";
}


function clearResponsePanel(){
  responseContainerNode.innerHTML = "";
}

function printNoMatchFound(){
    var title = document.createElement("h1");
    title.innerHTML = "No Match Found";

    allQuestionsListNode.appendChild(title);
}

// Resolve question form from the panel

