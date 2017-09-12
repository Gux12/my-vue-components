<template>
  <div class="container">
    <div class="icon-container">
      <div class="firstRing">
        <div class="secondRing">
          <div class="thirdRing">
            <div class="fourthRing">
              <div class="scan"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h2>Find iPhone</h2>
  </div>
</template>
<style lang="scss" scoped>
  //end bar
  h1, h2 {
    color: white;
    text-align: center;
    margin: 0;
    padding: 0;
    font-weight: 300;

  }

  .container {
    margin: 0 auto;
  }

  .icon-container {
    margin: 20px auto;
    width: 200px;
    height: 200px;
    border-radius: 20%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-color: #ececec;
    position: relative;
  }

  .firstRing {
    display: block;
    width: 160px;
    height: 160px;
    background-color: #2F883E;
    border-radius: 50%;
    border: 6px solid black;
    position: absolute;
    top: 15px;
    left: 15px;
    overflow: hidden;
  }

  .secondRing {
    width: 150px;
    height: 154px;
    background-color: transparent;
    border: 3px solid #44ff4e;
    border-radius: 50%;
    margin: 0 auto;
    vertical-align: middle;
    overflow: hidden;
  }

  .thirdRing {
    width: 100px;
    height: 100px;
    background-color: transparent;
    border: 3px solid #44ff4e;
    border-radius: 50%;
    margin: 0 auto;
    vertical-align: middle;
    position: absolute;
    top: 30px;
    left: 27.5px;
  }

  .fourthRing {
    width: 30px;
    height: 30px;
    background-color: transparent;
    border: 3px solid #44ff4e;
    border-radius: 50%;
    margin: 0 auto;
    vertical-align: middle;
    position: absolute;
    top: 32px;
    left: 32px;
  }

  .scan {
    width: 85px;
    height: 85px;
    margin: 0 auto;
    vertical-align: middle;
    position: absolute;
    top: 15px;
    left: 15px;
    overflow: hidden;
    background: linear-gradient(0deg, #44ff4e, #44ff4e 10%, transparent);
    animation: rotate 2s linear infinite;
    transform-origin: 0% 0%;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
