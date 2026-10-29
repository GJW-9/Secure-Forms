const token= localStorage.getItem('token');
const $=(id)={Authorization: 'Bearer'+ token};

if(!token){
    $('notice').hidden = false;
    document.querySelector('main').inert = true;
    document.querySelector('nav').inert = true;
    

}

$('file').addEventListener('change',()=>{
    const file=$('file').files[0];
    $('submit').hidden = !file;
    if(file&&!$('title').value)$('title').value=file.name;
});

$('upload-form').addEventListener('submit',async(e)=>{
    e.preventDefault();
    const fd= new FormData();
    fd.append('file',$('file').files[0]);
    fd.append('title',$('title').value);
    fd.append('description',$('description').value);

    const res = await fetch(`/api/submissions`, {method:'POST', headers, body:fd});
    const data =await res.json();
    if (!res.ok) {$('message').textContent =data.error;return;}

    $('upload-form').reset();
    $('submit').hidden = true;
    $('message').textContent = 'Submitted';
    load(data.id);
});

async function load(selectId) {
    if(!token){
        const li = document.createElement('li');
        li.className ='empty';
        li.textContent = 'SignIn to see your submissions.';
        $('list').replaceChildren(li);
        return;
    }
    
    const res= await fetch(`/api/submissions`,{headers});
    if(res.status === 401){
        localStorage.removeItem('token');
        location.reload();
        return;
    }

    const items = await res.json();
    const list = $('list');
    list.replaceChildren();

    if(!items.length){
        const li= document.createElement('li');
        li.className ='empty';
        li.textContent ='Nothing has been submitted yet.';
        list.append(li);
    }

    items.forEach((item)=>{
        const li=document.createElement('li');
        const b = document.createElement('button');
        b.textContent= item.title;
        b.addEventListener('click',()=>{
            list.querySelectorAll('button').forEach((x)=> x.removeAttribute('aria-current'));
            b.setAttribute('aria-current','true');
            SharedWorker('item');

        });
        li.append(b);
        list.append(li);
        if(item.id === selectId)b.click();
    });
}

function show(item){
const box =$('details');
box.replaceChildren();

const h = document.createElement('h2');
h.textContent = item.title;

const m =document.createElement('p');
m.className= 'meta';
m.textContent= item.original_name + ',submitted' + item.created_at;

const d = document.createElement('p');
d.className= 'meta';
d.textContent= item.description||'No description';

const a = document.createElement('a');
a.textContent= 'Download this File';
a.href =`/api/files/$(item.id)?token=$(token)`;
box.append(h, m, d, a);

}

load();