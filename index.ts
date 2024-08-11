// Import stylesheets
import './style.css';

//从html里选择用户输入的元素
//单词定义，叹号-非空断言
const form: HTMLFormElement = document.querySelector('#defineform')!;
const resultContainer: HTMLElement = document.querySelector('.lead')!;


//onsubmit - 事件监听 - 当用户提交的时候
//async - 被标记，因为它将发出异步网络请求
form.onsubmit = async (event) => {
  //阻止表单实际提交和刷新页面，表单的默认设置，允许提交的时候无需加载页面
  event.preventDefault();

  const formData = new FormData(form);

  const word = formData.get('defineword') as string;
  if (!word) {
    resultContainer.innerHTML = '<p>Please enter a word.</p>';
    return;
  }
  //获取api的返回结果，await：等待fetch完成再执行代码
  //const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}');
  //const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/${word}');
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);


  if (response.ok) {
    //解析json数据
    const data = await response.json();
    displayDefinition(data);
  } else {
    resultContainer.innerHTML = `<p>Could not find definition for "${word}".</p>`;
  }

  console.log(response);
  console.log(formData);
  return false; // prevent reload
};

//从api获取数据并转换为可以显示的html
function displayDefinition(data: any){

  if (!data || !Array.isArray(data) || data.length === 0) {
    resultContainer.innerHTML = '<p>No definition found.</p>';
    return;
  }

  //主要信息的meaning property
  const meanings = data[0].meanings;
  //map - 迭代数组中的每个含义，对于每个含义都会创建字符串
  const html = meanings.map((meaning: any) => `
    <h3>${meaning.partOfSpeech}</h3>
    <ul>
      ${meaning.definitions.map((def: any) => `<li>${def.definition}</li>`).join('')}
    </ul>
  `).join('');

  resultContainer.innerHTML = html;
}