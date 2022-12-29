# Generated by Django 4.1.1 on 2022-11-19 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0016_temp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='voter',
            name='gmm_file',
        ),
        migrations.RemoveField(
            model_name='voter',
            name='image',
        ),
        migrations.AddField(
            model_name='arizona_voter',
            name='finger_print',
            field=models.ImageField(default=None, upload_to='govt/az_voter/finger_print'),
        ),
    ]
