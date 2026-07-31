type ApiResponse = {
  status: (code: number) => {
    json: (payload: unknown) => void;
  };
};

export default function handler(_req: unknown, res: ApiResponse): void {
  res.status(410).json({
    error: "Endpoint deprecie",
    message: "Utilisez le backend /api/ai sur le service principal.",
  });
}
