import { define } from "../utils.ts";
import PlaneGame from "../islands/PlaneGame.tsx";

export default define.page(function Home() {
  return (
    <div class="h-screen w-screen overflow-hidden">
      <PlaneGame />
    </div>
  );
});
