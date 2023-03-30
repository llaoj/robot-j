package main

import (
	"context"

	"github.com/llaoj/robot-j/internal/GPT"
	"github.com/llaoj/robot-j/internal/chat"
)

func main() {
	gpt := GPT.NewGPT()
	ctx := context.Background()
	server := chat.NewServer(gpt, ctx)
	server.Run()
}
