from subprocess import run
from os import listdir, mkdir, remove, rename
from os.path import exists
from shutil import rmtree
from json import dump

iteration = len(listdir("album")) + 1

for gif in [i for i in listdir() if i.lower().endswith("gif")]:
    if exists("export"):
        rmtree("export")

    mkdir("export")
    run(["ffmpeg", "-i", gif, "-vf", "fps=0.5", "-vsync", "0", "export/%02d.png"])
    exports = sorted(listdir("export"))
    remove(f"export/{exports.pop()}")
    run(
        [
            "magick",
            "mogrify",
            "-format",
            "webp",
            "-define",
            "web:lossless=false",
            "-path",
            "export",
            "export/*.png",
        ]
    )

    for export in exports:
        remove(f'export/{export}')
    
    next_folder = f'album/{iteration:04d}'
    mkdir(next_folder)
    for file in listdir('export'):
        rename(f'export/{file}', f'{next_folder}/{file}')
    
    iteration += 1

if exists("export"):
    rmtree("export")

counts = {}
for folder in listdir('album'):
    counts[folder] = len(listdir(f'album/{folder}'))
    with open('counts.json', 'w') as fp:
        dump(counts, fp, sort_keys=True, indent=4)