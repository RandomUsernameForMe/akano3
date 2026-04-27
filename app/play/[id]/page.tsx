import { GamePage } from "@/components/views/game-page"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <GamePage id={id} />
}
