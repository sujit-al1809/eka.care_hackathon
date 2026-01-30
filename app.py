import gradio as gr
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import PeftModel

BASE_MODEL = "Qwen/Qwen2-1.5B-Instruct"
ADAPTER_PATH = "./indian-med-model"

bnb_config = BitsAndBytesConfig(load_in_8bit=True)

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)

model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    quantization_config=bnb_config,
    device_map="auto"
)

model = PeftModel.from_pretrained(model, ADAPTER_PATH)
model.eval()

def normalize_symptom(text):
    prompt = f"""### Instruction:
Translate and normalize the symptom into a standard medical term in ENGLISH ONLY.
Do not repeat the original language.

### Symptom:
{text}

### Output:
"""
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    out = model.generate(**inputs, max_new_tokens=30, do_sample=False)
    result = tokenizer.decode(out[0], skip_special_tokens=True)
    return result.split("Output")[-1].strip()

demo = gr.Interface(
    fn=normalize_symptom,
    inputs=gr.Textbox(label="Enter symptom (Indian language)"),
    outputs=gr.Textbox(label="Normalized English medical term"),
    title="Indian Medical Symptom Normalizer"
)

demo.launch()
