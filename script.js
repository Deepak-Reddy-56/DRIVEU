  const $ = (id)=>document.getElementById(id);

  // date helpers (kept same style)
  function formatDateLabel(dt){
    const months = ["Jan.","Feb.","Mar.","Apr.","May.","Jun.","Jul.","Aug.","Sept.","Oct.","Nov.","Dec."];
    const d = dt.getDate();
    const ord = (n)=> (n%10==1 && n%100!=11)? "st" : (n%10==2 && n%100!=12)? "nd" : (n%10==3 && n%100!=13)? "rd" : "th";
    return `${months[dt.getMonth()]} ${d}${ord(d)}`;
  }
  function formatTime(dt){
    let h = dt.getHours(), m = dt.getMinutes();
    const ampm = h>=12 ? "PM" : "AM";
    h = h%12; if(h===0) h = 12;
    return `${h}:${String(m).padStart(2,"0")}${ampm}`;
  }

  // map simple fields to canvas
  const bindings = [
    ["f_name","name"],
    ["f_trip","trip"],
    ["f_bid","bid"],
    ["f_dur","dur"],
    ["f_end_t","endTime"],
    ["f_from","from"],
    ["f_to","to"],
    ["f_amt","amt"],
    ["f_chip","chip"]
  ];

  function apply(){
    bindings.forEach(([a,b])=>{ $(b).textContent = $(a).value; });
    $("plusStrip").style.display = $("f_plus").value==="on" ? "block" : "none";
    $("prefBox").style.display  = $("f_pref").value==="on" ? "block" : "none";
    $("plusStrip").textContent = $("f_plus_text").value;


    const v = $("f_start_dt").value;
    if(v){
      const dt = new Date(v);
      $("startTime").textContent  = formatTime(dt);
      $("startTime2").textContent = formatTime(dt);
      const label = formatDateLabel(dt);
      $("dtLabel").textContent = `${label.replace(".","")} ,`;
      $("dateText").textContent  = label;
      $("dateText2").textContent = label;
    }
  }
  $("apply").addEventListener("click", apply);

  // default datetime now
  (function initNow(){
    const now = new Date();
    const iso = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);
    $("f_start_dt").value = iso;
    apply();
  })();

  // avatar from phone
  $("inp_avatar").addEventListener("change", (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{ $("avatar").src = reader.result; };
    reader.readAsDataURL(file);
  });

  // download JPG
  $("download").addEventListener("click", async()=>{
    apply();
    const node = $("capture");
    const canvas = await html2canvas(node, {scale:1, backgroundColor:null}); // canvas already 1272x2800
    const dataURL = canvas.toDataURL("image/jpeg", 0.92);
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "driveu-screenshot.jpg";
    a.click();
  });