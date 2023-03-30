package main

import (
	"context"

	"github.com/llaoj/robot-j/internal/GPT"
	"github.com/llaoj/robot-j/internal/chat"
	"github.com/llaoj/robot-j/internal/config"
)

func main() {
	config := config.NewConfig()
	gpt := GPT.NewGPT(&config.GPT)
	ctx := context.Background()
	server := chat.NewServer(gpt, ctx, &config.ChatServer)
	server.Run()
}
