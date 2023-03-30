package GPT

import (
	"context"
	"fmt"

	"github.com/llaoj/robot-j/internal/config"
	openai "github.com/sashabaranov/go-openai"
)

type GPT struct {
	client *openai.Client
}

func NewGPT(config *config.GPT) *GPT {
	client := openai.NewClient(config.APIKey)
	return &GPT{
		client: client,
	}
}

func (gpt *GPT) CreateChatCompletion(ctx context.Context, content string) string {
	response, err := gpt.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: content,
				},
			},
		},
	)
	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return ""
	}
	return response.Choices[0].Message.Content
}
