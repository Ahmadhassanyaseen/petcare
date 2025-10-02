import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      )
    }

    // Get ElevenLabs API key from environment
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
    if (!apiKey) {
      console.error('ElevenLabs API key not configured')
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    console.log('Making request to ElevenLabs API for agent:', agentId)

    // Get conversation token from ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('ElevenLabs API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', response.status, errorText)
      return NextResponse.json(
        {
          error: `Failed to get conversation token from ElevenLabs: ${response.status} - ${errorText}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('ElevenLabs API response:', data)

    if (!data || !data.token) {
      console.error('Invalid response format from ElevenLabs:', data)
      return NextResponse.json(
        { error: 'Invalid response format from ElevenLabs API' },
        { status: 502 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting conversation token:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    )
  }
}
