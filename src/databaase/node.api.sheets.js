export default async function DataSheets(
  url,
  { sheetLabel, projectId, ...props },
) {
  try {
    const response = await fetch(`${process.env.BASEURL_GOOGLESHEETS}${url}`, {
      method: "post",
      body: JSON.stringify({
        sheetLabel,
        projectId,
        sheetColumns: "A:Z",
        ...props,
      }),
    });

    if (!response.ok) {
      console.log(`HTTP ${response.status}`);
      return { status: false, error: "fail" };
    }
    const data = response.json();
    return data;
  } catch (Err) {
    console.log(`API DataSheets erro:`, Err);
    return { status: false, error: "bad-request" };
  }
}

export const SheetsFilter = (data) => {
  return data?.map((it) => {
    const [column, search] = it?.split(".");
    return {
      column,
      search,
    };
  });
};
