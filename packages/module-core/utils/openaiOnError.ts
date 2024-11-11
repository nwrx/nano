export async function openaiOnError(response: Response) {
  try {
    const data = await response.json() as { error: { message: string } }
    return data.error.message
  }
  catch {
    return `OpenAI: ${response.statusText}`
  }
}
