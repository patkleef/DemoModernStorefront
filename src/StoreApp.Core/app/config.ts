export const config = {
  currentEmailAddress: "patrick.van.kleef@gmail.com",
  currentDate: getCurrentDate(), //"2019-01-03",
  profileStoreKey: "",
  useRepositoryStub: false
};

function getCurrentDate() {
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  let result = yyyy.toString() + "-";
  result += (mm < 10 ? "0" + mm : mm) + "-";
  result += dd < 10 ? "0" + dd : dd;

  return result;
}
