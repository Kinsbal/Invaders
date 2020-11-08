//Created by: sarosiba@gmail.com

let app = new PIXI.Application({ 
    width: 800, 
    height: 600,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
  }
  );
  
  document.getElementById("display").appendChild(app.view);
  
  //Stage
  var stage = new PIXI.Container();

  //Characters
  var player;
  var enemy;
  var enemies = [];
  var enemySpeed = 6;
  
  //Interact
  var bullet;
  var bullets = [];
  var bulletSpeed = 8;
  
  //Scoring
  var score = 0;
  var highscore;
  
  //Dead
  var ingame;
  var dead;
  var once;
  var exploded;


  //Movement & play area
  var keys = {};
  var borderW;
  var borderH;
  
  //Menu
  var splashP;
  var title;
  var menuBg;
  var game1;
  var game2;
  var game3;
  var exit;

  //Explode animation
  var rect;
  var sprite;
  var texture;
  var sprites = [];
  
  var buttons = [];
  var buttonPositions = [
    250,
    320,
    390,
    460
  ];

  //Background textures
  var far;
  var mid;

  var midTex;
  var farTex;
 
  //Loading images, textures
  PIXI.loader
  .add([
    "images/player.png",
    "images/rocket.png",
    "images/enemy.png",
    "images/explode.png",
    "images/bg-far.png",
    "images/bg-mid.png",
    "images/title.png",
    "images/menuBg.png",
    "images/game1.png",
    "images/game2.png",
    "images/game3.png",
    "images/exit.png",
    "images/splash.png"
  ])
  .load(mainMenu);
  
  function mainMenu(){
    menuBg = new PIXI.Sprite(PIXI.loader.resources["images/menuBg.png"].texture);
    title = new PIXI.Sprite(PIXI.loader.resources["images/title.png"].texture);
    game1 = new PIXI.Sprite(PIXI.loader.resources["images/game1.png"].texture);
    game2 = new PIXI.Sprite(PIXI.loader.resources["images/game2.png"].texture);
    game3 = new PIXI.Sprite(PIXI.loader.resources["images/game3.png"].texture);
    exit = new PIXI.Sprite(PIXI.loader.resources["images/exit.png"].texture);
  
    buttons.push(game1, game2, game3, exit);
  
    menuBg.position.x = 0;
    menuBg.position.y = 0;
    app.stage.addChild(menuBg);
  
  
    title.scale.set(0.5, 0.5);
    title.position.x = app.view.width / 2;
    title.position.y = app.view.width / 5;
    title.anchor.set(0.5, 0.5);
    app.stage.addChild(title);
    
  
    for (h = 0; h < buttons.length; h++){ 
  
      buttons[h].anchor.set(0.5, 0.5);
      buttons[h].scale.set(0.4, 0.4);
      buttons[h].position.x = app.view.width / 2;
      buttons[h].position.y = buttonPositions[h];

      app.stage.addChild(buttons[h]);
    }
   
  
    //Buttons; calling each separately to handle separate requests
    buttons[0].on('pointerdown', clickEffect0);
    buttons[1].on('pointerdown', clickEffect1);
    buttons[2].on('pointerdown', clickEffect2);
    buttons[3].on('pointerdown', clickEffect3);

    buttons[0].on('pointerup', startG);
    buttons[1].on('pointerup', startG);
    buttons[2].on('pointerup', startG);
    buttons[3].on('pointerup', exitG);
  
    
  
  //Splash on top of everything
    splashP = new PIXI.Sprite(PIXI.loader.resources["images/splash.png"].texture);
    splashP.position.x = 0;
    splashP.position.y = 0;
    app.stage.addChild(splashP);
    setTimeout(function(){
      setInterval(fade, 40);
      app.ticker.add(user);
     }, 2000);
   
     app.stage.interactive=false;
     
  }
  
  function fade(){
        if (splashP.alpha === 0){
            return;
        } else {
        splashP.alpha -= 0.1;
        }
    }

  function user(){
  
    for (g = 0; g < buttons.length; g++){ 
      if (ingame === true){
        buttons[g].interactive = false;
        buttons[g].buttonMode = false;
      } else {
        buttons[g].interactive = true;
        buttons[g].buttonMode = true;
      }

      if (dead===true) {
        buttons[g].interactive = true;
        buttons[g].buttonMode = true;
        app.stage.interactive=false;

        if (!once) {
          once=true;
            newGame(false);
        }
      } 
  
    }
    return dead, ingame
  }
  
  function clickEffect0() {
    game1.alpha=0.3;
    setTimeout(function(){
        game1.alpha=1;
      }, 150);
  }
  function clickEffect1() {
    game2.alpha=0.3;
    setTimeout(function(){
        game2.alpha=1;
      }, 150);
  }
  function clickEffect2() {
    game3.alpha=0.3;
    setTimeout(function(){
        game3.alpha=1;
      }, 150);
  }
  function clickEffect3() {
    exit.alpha=0.3;
    setTimeout(function(){
        exit.alpha=1;
      }, 150);
  }

  function startG() {
    once=null;
    exploded=null;
    dead=false;
    ingame=true;
    score=0;
    app.stage.interactive = true;
    newGame(true);

  }
  
  function exitG() {
    window.open("https://www.playngo.com/Games")
    console.log("Exit")
  }
  

  //New game
  function newGame(ingame) {
    if (ingame == true || ingame == undefined || ingame == null) {

    //Character textures
    player = new PIXI.Sprite(PIXI.loader.resources["images/player.png"].texture);
    
    //Background textures
    var midTex = PIXI.Texture.fromImage("images/bg-mid.png");
    mid= new PIXI.extras.TilingSprite(midTex, 4000, 2998);

    var farTex = PIXI.Texture.fromImage("images/bg-far.png");
    far= new PIXI.extras.TilingSprite(farTex, 1066, 600);
  
    //Player settings
    player.scale.set(0.15, 0.15);
    player.x = app.view.width / 8;
    player.y = app.view.height / 2;
    player.anchor.set(0.5, 0.5);
  
    //Player boundaries
    borderW = app.view.width;
    borderH = app.view.height;
    //Cannot go off the map, just a tiny bit;
    app.ticker.add(borderLimit);
   
    //Background position
    far.position.x = 0;
    far.position.y = 0;
    mid.position.x = 0;
    mid.position.y = 20;

    far.tilePosition.x = 0;
    far.tilePosition.y = 0;
    mid.tilePosition.x = 0;
    mid.tilePosition.y = 20;

     // far.alpha = 0
  
    //Adding sprites to the stage
    app.stage.addChild(far);
    app.stage.addChild(mid);
    app.stage.addChild(player);
  
    //Background animation
    requestAnimationFrame(updateBg);
  
    //Player movement
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);
    app.ticker.add(movement);
  
  
    //Player shooting
    app.stage.interactive = true;

    app.stage.on("pointerdown", fireBullet);
    app.ticker.add(fireLoop);
   
    //Enemy spawn & creation in every 2 secs + enemy AI
    newSpawn = setInterval(newEnemy, 2000);
    app.ticker.add(enemyAnimation);
  
    //Default score value
    if (score === 0) {
      document.getElementById("scoreDiv").innerHTML = "Score: "+score;
    }
  
    //User action check
    app.ticker.add(user);
    
    } else {
      //If the player dies, go back to the main menu & destroy all elements;
      app.ticker.remove(enemyAnimation);
      app.ticker.remove(movement);
      app.ticker.remove(borderLimit);
      app.ticker.remove(fireLoop);
      clearInterval(newSpawn);
      app.stage.removeChild(far);
      app.stage.removeChild(mid);
      app.stage.removeChild(player);
      app.stage.removeChild(enemy);
      app.stage.removeChild(bullet);
      app.stage.off("pointerdown", fireBullet);
      window.removeEventListener("keydown", keysDown);
      window.removeEventListener("keyup", keysUp);

      far = null;
      mid = null;
      player = null;
      enemy = null;
      bullet = null;
      sprite = null;
  
      for (l = 0; l < enemies.length; l++){ 
        enemies.splice(l,1000)
      }
  
      enemies = [];
      for (n = 0; n < bullets.length; n++){ 
        bullets.splice(n,1000)
      }
      bullets = [];

      for (i = 0; i < sprites.length; i++){ 
        sprites.splice(i,1000)
      }
      sprites = [];
  
    
    }
  }
  
  
  function updateBg() {
    if (dead === true) {
        return;
    } else {
      far.tilePosition.x -= 0.128;
      mid.tilePosition.x -= 0.64;

      requestAnimationFrame(updateBg);
    }
  }
  
  
  
  //Movement
  function keysDown(e){
    keys[e.keyCode] = true;
  }
  function keysUp(e){
    keys[e.keyCode] = false;
  }
  function movement() {
  
    if (keys["37"]){
      player.x -= 5;
    }
    if (keys["38"]){
      player.y -= 5;
    }
    if (keys["39"]){
      player.x += 5;
    }
    if (keys["40"]){
      player.y += 5;
    }
  
  }
  
  //Actions
  function fireBullet(){
    if (dead === true) {
        return;
    } else {
  
    bullet = createBullet();
    bullets.push(bullet);
   
      }
  }

  function createBullet(){
    if (dead === true){
        return;
    } else {

    bullet = new PIXI.Sprite(PIXI.loader.resources["images/rocket.png"].texture);
    bullet.anchor.set(0.5);
    bullet.x = player.x + 30;
    bullet.y = player.y;
    bullet.speed = bulletSpeed;
    app.stage.addChild(bullet);
    return bullet;
  
    }
  
  }
  function updateBullets(){

      if (dead === true) {
        return;
      } else {
    
  
    for (i = 0; i < bullets.length; i++){
      bullets[i].position.x += bullets[i].speed;
  
      if (bullets[i].position.y < 0){
        bullets[i].dead = true;
      }
    }
  
    for (i = 0; i < bullets.length; i++){
      bullets[i].position.x += bullets[i].speed;
  
      if (bullets[i].dead){
        app.stage.removeChild(bullets[i]);
        bullets.splice(i, 1);
      }
    }
  
    
  }
   
  
  }
  
  function fireLoop(event){
    if (dead === true) {
        return;
    } else {
    updateBullets(event);
    }
  }
  
  
  
  //Enemies
  function newEnemy(){
    if (dead === true){
        return;
    } else {
    enemy = createEnemy();
    enemies.push(enemy);
    }
  }
  
  function createEnemy(){
  
    enemy = new PIXI.Sprite(PIXI.loader.resources["images/enemy.png"].texture);
    enemy.scale.set(0.2, 0.2);
    enemy.anchor.set(0.5);
    enemy.x = 810;
    enemy.y = Math.floor(Math.random() * (550 - 50) ) + 50;
    enemy.speed = enemySpeed;
    app.stage.addChild(enemy);
    return enemy
  
  }
  
  function enemyAnimation(){
    if (dead === true){
        return;
    } else {
  
      for (i = 0; i < enemies.length; i++){ 
        enemies[i].position.x -= enemySpeed;
  
       if (enemies[i]){
        if (deadZones(player, enemies[i])) { 
          
    
            
            app.stage.removeChild(bullet);
            app.stage.interactive = false;
            explodeSelf();
           
          //Wait for death animation then die
          setTimeout(function(){
            dead=true;
            document.getElementById("scoreDiv").innerHTML = "";
           }, 2000);
         
  
          } 
        }
    
      for (j = 0; j < bullets.length; j++){
  
          if (bullets[j] && enemies[i]) {
            if (deadZones(bullets[j], enemies[i])) { 
  
              explodeTarget(enemies[i]);
  
              app.stage.removeChild(enemies[i]);
              enemies.splice(i,1);

              app.stage.removeChild(bullets[j]);
              bullets.splice(j,1);
  
              //Scoring
              score+=100;
              document.getElementById("scoreDiv").innerHTML = "Score: "+score;
              console.log(score);
            } 
          }
      }
    }
  }
 }

  
  
  function deadZones(a, b) {
    if (dead === true) {
        return;
    } else {
  
    let aZone = a.getBounds();
    let bZone = b.getBounds();
  
    return aZone.x + aZone.width > bZone.x &&
  
    aZone.x < bZone.x + bZone.width &&
    aZone.y + aZone.height > bZone.y &&
    aZone.y < bZone.y + bZone.height;
  
    } 
  }
  
  
  
  function borderLimit() {
    if (dead === true) {
        return;
    } else {
  
    if (player.x < 0) {
        player.x = 0;
    }
  
    if (player.x > borderW) {
        player.x = borderW;
    }
  
    if (player.y < 0) {
      player.y = 0;
    }
  
    if (player.y > borderH) {
      player.y = borderH;
    }
      } 
  
   }
  
  function explodeSelf() {
    if (!exploded){
      exploded = true;
      app.stage.removeChild(player);
      explodeEffect(player);
    } else {
    }
  }
  
  function explodeTarget(target) {
      explodeEffect(target);
  }
  
  
  function explodeEffect(target){
    rect = new PIXI.Rectangle(0,0,64,64);
    texture = PIXI.loader.resources["images/explode.png"].texture;
    texture.frame = rect;
    
    sprite = new PIXI.Sprite(texture);
    app.stage.addChild(sprite);
    
    sprite.scale.set(2, 2);
    sprite.anchor.set(0.5);
  
 

    sprites.push(sprite);

    for (n = 0; n < sprites.length; n++){    
    sprites[n].x = target.x;
    sprites[n].y = target.y;
    }

          let handler = setInterval(function() {

               
            if (rect.x === 704){

                for (k = 0; k < sprites.length; k++){    
                app.stage.removeChild(sprites[k])
                } 
              clearInterval(handler)
        
            } else {
            
            if (rect.x >= 64 * 11) rect.x = 0;
            rect.x += 64;
            sprite.texture.frame = rect;
            }
        }, 80);
        
        
   }
  
  
