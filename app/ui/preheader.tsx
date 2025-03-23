export default async function Preheader() {
  try {
    const data = await fetch(
      "https://ruksalamode.com/api/content/get-pretext",
      {
        cache: "no-store",
      }
    );
    const text = await data.json();

    return (
      <>
        {text ? (
          <div className="w-full py-1 bg-[#bb3a00] flex items-center justify-center">
            <div className="items-center flex flex-col justify-center">
              <p className="md:text-xs text-[10px] text-lightgrey text-center font-semibold leading-loose tracking-wider">
                {text?.preText}
              </p>
            </div>
          </div>
        ) : null}
      </>
    );
  } catch (e) {
    return <></>;
  }
}
