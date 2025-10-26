.PHONY: setup datasets models run package-godmode
setup:
	python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
datasets:
	. venv/bin/activate && python datasets/download_real_data.py
models:
	. venv/bin/activate && python scripts/download_models.py
run:
	. venv/bin/activate && uvicorn main:app --reload
package-godmode:
	cd .. && zip -r nyay-samiti_godmode.zip nyay-samiti
