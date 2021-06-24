export const harperFetch = async (body) => {
  const request = await fetch(process.env.DB, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.DB_KEY}`,
    },
    body: JSON.stringify(body),
  });

  return request.json();
};
