// import Settings from "../../config";

// const StormTime = 5200;
// let StormSaid = false
// let StormTimers = 0
// let timeRemaining = 0

// register("chat", (message) => {
//     StormSaid = true
//     StormTimers = Date.now()
// }).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")

// register("renderOverlay", () => {
//       if (!Settings().stormTimer) return;
//       if (!StormSaid) return;

//       const timePassed = Date.now() - StormTimers;
//       timeRemaining = (StormTime - timePassed) / 1000
//       if (timePassed > StormTime) {
//         StormSaid = false
//       }

//       if (timeRemaining < 0) return; 
    
//       Renderer.scale(1)
//       Renderer.drawString('&f' + timeRemaining.toFixed(1), (Renderer.screen.getWidth() - Renderer.getStringWidth(timeRemaining.toFixed(1))) / 2, 275, true);
    
// })