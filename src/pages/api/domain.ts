export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  try {
    // Should call a different api to get the data from the domains pages..
    const { domain } = (await req.json()) as {
      domain: string;
    };

    return new Response(
      JSON.stringify({
        message:
          "Hanlding your domain will take a while untils we get all the pages",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
