import { BunFile } from 'bun'

class File {
  constructor() {
    //
  }

  async touch(fileName: BunFile | PathLike, content: string | undefined) {
    const encoder = new TextEncoder()
    const data = encoder.encode(content) // Uint8Array
    await Bun.write(fileName, data)
  }
}

export default new File()
