window.onload = function () {
  memberDiv = document.getElementById("member_div");
  addMember = document.getElementById("add_member");

  nameNum = 3;

  addMember.addEventListener("click", function () {
    console.log("asdasd");

    const newDiv = document.createElement("div");
    newDiv.innerHTML = `<div class="flex flex-col gap-1">
              <div class="flex gap-1">
                <div
                  class="border border-sky-500/50 rounded-xl py-2 px-5 bg-sky-600/10 flex items-center gap-5 flex-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    class="size-10 fill-sky-600 drop-shadow-[0_5px_5px_rgba(2,132,199,.3)]"
                  >
                    <path
                      d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm-3.48,20.299c.107-1.835,1.619-3.299,3.48-3.299s3.373,1.464,3.48,3.299c-1.071.451-2.247.701-3.48.701s-2.409-.25-3.48-.701Zm9.668-1.781c-.84-2.617-3.296-4.518-6.188-4.518s-5.348,1.901-6.188,4.518c-1.727-1.641-2.812-3.953-2.812-6.518C3,7.037,7.038,3,12,3s9,4.037,9,9c0,2.565-1.084,4.877-2.812,6.518Zm-2.689-10.018c0,1.933-1.567,3.5-3.5,3.5s-3.5-1.567-3.5-3.5,1.567-3.5,3.5-3.5,3.5,1.567,3.5,3.5Z"
                    />
                  </svg>

                  <div class="flex flex-col flex-1">
                    <label
                      for="name${nameNum}"
                      class="text-sm font-normal text-sky-500/80"
                      >Name</label
                    >
                    <input
                      type="text"
                      name="name${nameNum}"
                      id="name${nameNum}"
                      placeholder="Name"
                      class="bg-sky-500/10 border-sky-500/50 w-full border px-3 py-0.5 rounded-md placeholder:text-sky-400/50 focus:bg-sky-500/20 active:bg-sky-500/30 text-sky-50 outline-0 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>`;
    memberDiv.appendChild(newDiv);
    nameNum += 1;
  });
};
